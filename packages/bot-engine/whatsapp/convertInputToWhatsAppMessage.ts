import {
  BubbleBlockType,
  ButtonItem,
  ChatReply,
  InputBlockType,
} from '@typebot.io/schemas'
import { WhatsAppSendingMessage } from '@typebot.io/schemas/features/whatsapp'
import { convertRichTextToWhatsAppText } from './convertRichTextToWhatsAppText'
import { isDefined, isEmpty } from '@typebot.io/lib/utils'

export const convertInputToWhatsAppMessages = (
  input: NonNullable<ChatReply['input']>,
  lastMessage: ChatReply['messages'][number] | undefined
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       // @ts-ignore
): WhatsAppSendingMessage[] => {
  const lastMessageText =
    lastMessage?.type === BubbleBlockType.TEXT
      ? convertRichTextToWhatsAppText(lastMessage.content.richText)
      : undefined
  switch (input.type) {
    case InputBlockType.DATE:
    case InputBlockType.EMAIL:
    case InputBlockType.FILE:
    case InputBlockType.NUMBER:
    case InputBlockType.PHONE:
    case InputBlockType.URL:
    case InputBlockType.PAYMENT:
    case InputBlockType.RATING:
    case InputBlockType.TEXT:
      return []
    case InputBlockType.PICTURE_CHOICE: {
      if (input.options.isMultipleChoice)
        return input.items.flatMap((item, idx) => {
          let bodyText = ''
          if (item.title) bodyText += `*${item.title}*`
          if (item.description) {
            if (item.title) bodyText += '\n\n'
            bodyText += item.description
          }
          const imageMessage = item.pictureSrc
            ? ({
                type: 'image',
                image: {
                  link: item.pictureSrc ?? '',
                },
              } as const)
            : undefined
          const textMessage = {
            type: 'text',
            text: {
              body: `${idx + 1}. ${bodyText}`,
            },
          } as const
          return imageMessage ? [imageMessage, textMessage] : textMessage
        })
      return input.items.map((item) => {
        let bodyText = ''
        if (item.title) bodyText += `*${item.title}*`
        if (item.description) {
          if (item.title) bodyText += '\n\n'
          bodyText += item.description
        }
        return {
          type: 'interactive',
          interactive: {
            type: 'button',
            header: item.pictureSrc
              ? {
                  type: 'image',
                  image: {
                    link: item.pictureSrc,
                  },
                }
              : undefined,
            body: isEmpty(bodyText) ? undefined : { text: bodyText },
            action: {
              buttons: [
                {
                  type: 'reply',
                  reply: {
                    id: item.id,
                    title: 'Select',
                  },
                },
              ],
            },
          },
        }
      })
    }
    case InputBlockType.CHOICE: {
      if (input.options.isMultipleChoice)
        return [
          {
            type: 'text',
            text: {
              body:
                `${lastMessageText}\n\n` +
                input.items
                  .map((item, idx) => `${idx + 1}. ${item.content}`)
                  .join('\n'),
            },
          },
        ]
      const items = groupArrayByArraySize(
        input.items.filter((item) => isDefined(item.content)),
        3
      ) as ButtonItem[][]
      return items.map((items, idx) => ({
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: idx === 0 ? lastMessageText ?? '...' : '...',
          },
          action: {
            buttons: items.map((item) => ({
              type: 'reply',
              reply: {
                id: item.id,
                title: trimTextTo20Chars(item.content as string),
              },
            })),
          },
        },
      }))
    }
  }
}

const trimTextTo20Chars = (text: string): string =>
  text.length > 20 ? `${text.slice(0, 18)}..` : text

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupArrayByArraySize = (arr: any[], n: number) =>
  arr.reduce(
    (r, e, i) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r,
    []
  )
