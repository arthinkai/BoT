import {
  Block,
  InputStep,
  PublicBlock,
  PublicStep,
  PublicTypebot,
  Typebot,
} from 'models'
import shortId from 'short-uuid'
import { HStack, Text } from '@chakra-ui/react'
import { CalendarIcon } from 'assets/icons'
import { StepIcon } from 'components/editor/StepsSideBar/StepIcon'
import { isInputStep, sendRequest } from 'utils'
import { isDefined } from '@udecode/plate-common'

export const parseTypebotToPublicTypebot = (
  typebot: Typebot
): PublicTypebot => ({
  id: shortId.generate(),
  typebotId: typebot.id,
  blocks: parseBlocksToPublicBlocks(typebot.blocks),
  edges: typebot.edges,
  name: typebot.name,
  publicId: typebot.publicId,
  settings: typebot.settings,
  theme: typebot.theme,
  variables: typebot.variables,
})

const parseBlocksToPublicBlocks = (blocks: Block[]): PublicBlock[] =>
  blocks.map((b) => ({
    ...b,
    steps: b.steps.map(
      (s) =>
        ('webhook' in s && isDefined(s.webhook)
          ? { ...s, webhook: s.webhook.id }
          : s) as PublicStep
    ),
  }))

export const createPublishedTypebot = async (
  typebot: Omit<PublicTypebot, 'id'>
) =>
  sendRequest<PublicTypebot>({
    url: `/api/publicTypebots`,
    method: 'POST',
    body: typebot,
  })

export const updatePublishedTypebot = async (
  id: string,
  typebot: Omit<PublicTypebot, 'id'>
) =>
  sendRequest({
    url: `/api/publicTypebots/${id}`,
    method: 'PUT',
    body: typebot,
  })

export const parseSubmissionsColumns = (
  typebot: PublicTypebot
): {
  Header: JSX.Element
  accessor: string
}[] => {
  return [
    {
      Header: (
        <HStack>
          <CalendarIcon />
          <Text>Submitted at</Text>
        </HStack>
      ),
      accessor: 'createdAt',
    },
    ...typebot.blocks
      .filter(
        (block) => typebot && block.steps.some((step) => isInputStep(step))
      )
      .map((block) => {
        const inputStep = block.steps.find((step) => isInputStep(step))
        if (!inputStep || !isInputStep(inputStep)) return
        return {
          Header: (
            <HStack
              minW={
                'isLong' in inputStep.options && inputStep.options.isLong
                  ? '400px'
                  : '150px'
              }
              maxW="500px"
            >
              <StepIcon type={inputStep.type} />
              <Text>{block.title}</Text>
            </HStack>
          ),
          accessor: block.id,
        }
      })
      .filter(isDefined),
  ]
}