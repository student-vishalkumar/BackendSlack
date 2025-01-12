import { StatusCodes } from "http-status-codes";

import Channel from "../Schema/channel.js";
import User from "../Schema/user.js";
import Workspace from "../Schema/workspace.js";
import ClientError from "../utils/error/ClientError.js";
import crudRepository from "./crudRepository.js";

const workspaceRepository = {
    ...crudRepository(Workspace),

    getWorkspaceByName: async function(workspaceName) {
        const workspace = await Workspace.findOne(
            { name: workspaceName });

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not find',
                statsCode: StatusCodes.NOT_FOUND
            });
        }
        return workspace;
    },

    getWorkspaceByJoinCode: async function(joinCode) {
        const workspace = await Workspace.findOne({ joinCode });

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not found',
                statusCode: StatusCodes.NOT_FOUND 
            });
        }
        return workspace;
    },

    addMemberToWorkspace: async function(workspaceId, memberId, role){
        console.log('workspace id at addmemfun',workspaceId);
        const workspace = await Workspace.findById(workspaceId);

        console.log('workspace find', workspace);

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not found',
                statusCode: StatusCodes.NOT_FOUND 
            });
        }

        console.log('memberid at add mem fun', memberId)

        const isValidUser = await User.findById(memberId);

        if(!isValidUser) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'user not found',
                statusCode: StatusCodes.NOT_FOUND 
            })
        }

        const isMemberAlreadyPartOfWorkspace = workspace.members.find( (member) => member.memberId == memberId);

        

        if(isMemberAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'member already part of workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        workspace.members.push({
            memberId,
            role
        });

        console.log('workspace after adding member', workspace);

        await workspace.save();

        return workspace;
    },

    addChannelToWorkspace: async function(workspaceId, channelName) {
        const workspace = await Workspace.findById(workspaceId).populate('channels');

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        };

        // const isValidChannel = await Channel.findById(channelName);

        // if(!isValidChannel) {
        //     throw new ClientError({
        //         explanation: 'Inavlid data sent from the client',
        //         message: 'channel not found',
        //         statusCode: StatusCodes.NOT_FOUND
        //     });
        // };

        const isChannelAlreadyPartOfWorkspace = workspace.channels.find((channel) => channel.name === channelName);

        if(isChannelAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'channel is already present in the workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        };

        const channel = await Channel.create({ name: channelName });

        workspace.channels.push(channel);

        await workspace.save();

        return workspace;
    },

    fetchAllWorkspaceByMemberId: async function (memberId) {
        const workspaces = Workspace.find({
          'members.memberId': memberId
        }).populate('members.memberId', 'username email avatar');
        return workspaces;
    }
}

export default workspaceRepository;