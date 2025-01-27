import { addEdgeToTypebot, createPortalEdge } from '../../../addEdgeToTypebot'
import { ExecuteLogicResponse } from '../../../types'
import { TRPCError } from '@trpc/server'
import { SessionState } from '@typebot.io/schemas'
import { JumpBlock } from '@typebot.io/schemas/features/blocks/logic/jump'

export const executeJumpBlock = (
  state: SessionState,
  { groupId, blockId }: JumpBlock['options']
): ExecuteLogicResponse => {
  const { typebot } = state.typebotsQueue[0]
  const groupToJumpTo = typebot.groups.find((group) => group.id === groupId)
  const blockToJumpTo =
    groupToJumpTo?.blocks.find((block) => block.id === blockId) ??
    groupToJumpTo?.blocks[0]

  if (!blockToJumpTo?.groupId)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Block to jump to is not found',
    })

  const portalEdge = createPortalEdge({
    to: { groupId: blockToJumpTo?.groupId, blockId: blockToJumpTo?.id },
  });
  console.log("portal edge", JSON.stringify(portalEdge) );
  console.log("prev state", state );
  const newSessionState = addEdgeToTypebot(state, portalEdge)
  console.log("new session state", JSON.stringify(newSessionState) );
  return { outgoingEdgeId: portalEdge.id, newSessionState }
}
