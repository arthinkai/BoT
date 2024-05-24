import { Text } from '@chakra-ui/react'
import { CardInputBlock } from '@typebot.io/schemas'

type Props = {
  block: CardInputBlock
}

export const CardInputContent = ({ block }: Props) => {
  console.log("block", block);
  return <Text color="gray.500">Configure Card...</Text>

}