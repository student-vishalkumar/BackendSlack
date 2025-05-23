import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import ClientError from '../utils/error/ClientError.js'
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const getMessagePaginatedService = async (
  messageParams,
  page,
  limit,
  user
) => {
  const channelDetails = await channelRepository.getChannelWithWorkspaceDetails(
    messageParams.channelId
  );

  const workspace = channelDetails.workspaceId;

  const isMember = isUserMemberOfWorkspace(workspace, user);

  if (!isMember) {
    throw new ClientError({
      explanation: 'User is not a member of the workspace',
      message: 'User is not a member of the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }
  const messages = await messageRepository.getPaginatedMessaged(
    messageParams,
    page,
    limit
  );

  return messages;
};


export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message);

  const messageDeatails = await messageRepository.getMessageDetails(newMessage._id);
  return messageDeatails;
}

// export const deleteMessageService = async(id) => {

// }