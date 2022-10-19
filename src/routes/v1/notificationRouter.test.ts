import {generateRandomEthereumAddress, getGivethIoBasicAuth, serverUrl} from "../../../test/testUtils";
import axios from "axios";
import {assert} from "chai";
import {errorMessages, errorMessagesEnum} from "../../utils/errorMessages";

describe('/notifications POST test cases', sendNotification);

function sendNotification() {
    const sendNotificationUrl = `${serverUrl}/v1/thirdParty/notifications`
    const projectTitle = 'project title'
    const projectLink = 'https://giveth.io/project/project-title'

    it('should create *Incomplete profile* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Incomplete profile',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {}
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        console.log('**result**', result.data)
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);

    });

    it('should create *The profile has been completed* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'The profile has been completed',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {}
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        console.log('**result**', result.data)
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);

    });


    it('should create *Admin message* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Admin message',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                href: 'href',
                linkTitle: 'linkTitle',
                instruction: 'instruction',
                content: 'content'
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Admin message* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Admin message',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    href: 'href',
                    instruction: 'instruction',
                    content: 'content'
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"linkTitle" is required')
        }
    });


    it('should create *draft project saved* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'The project saved as draft',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *draft project saved* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'The project saved as draft',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Draft published* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Draft published',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Draft published* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Draft published',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project listed* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project listed',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project listed* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project listed',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project unlisted* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project unlisted',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project unlisted* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project unlisted',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project unlisted - Donors* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project unlisted - Donors',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project unlisted - Donors* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project unlisted - Donors',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project unlisted - Users Who Liked* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project unlisted - Users Who Liked',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project unlisted - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project unlisted - Users Who Liked',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project cancelled* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project cancelled',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project cancelled* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project cancelled',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project cancelled - Donors* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project cancelled - Donors',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project cancelled - Donors* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project cancelled - Donors',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project cancelled - Users Who Liked* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project cancelled - Users Who Liked',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project cancelled - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project cancelled - Users Who Liked',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project activated* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project activated',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project activated* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project activated',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project activated - Donors* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project activated - Donors',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project activated - Donors* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project activated - Donors',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project activated - Users Who Liked* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project activated - Users Who Liked',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project activated - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project activated - Users Who Liked',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project deactivated* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project deactivated',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
                reason: 'hi'
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project deactivated* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project deactivated',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project deactivated - Donors* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project deactivated - Donors',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
                reason: 'hi'
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project deactivated - Donors* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project deactivated - Donors',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project deactivated - Users Who Liked* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project deactivated - Users Who Liked',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
                reason: 'hi'
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project deactivated - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project deactivated - Users Who Liked',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project verified* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project verified',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project verified* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project verified',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project verified - Donors* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project verified - Donors',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project verified - Donors* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project verified - Donors',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project verified - Users Who Liked* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project verified - Users Who Liked',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project verified - Users Who Liked* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project verified - Users Who Liked',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Form sent (Under review)* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Form sent (Under review)',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Form sent (Under review)* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Form sent (Under review)',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Form rejected* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Form rejected',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
                reason: 'hi'
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Form rejected* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Form rejected',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Re-apply for verification reminder* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Re-apply for verification reminder',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
                href: 'href'
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Re-apply for verification reminder* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Re-apply for verification reminder',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                    href:'href'
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Claim* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Claim',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {}
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        console.log('**result**', result.data)
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);

    });


    it('should create *Rewards harvested* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Rewards harvested',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {}
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        console.log('**result**', result.data)
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);

    });


    it('should create *Stake* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Stake',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                poolName:'GIV farm',
                amount:'20',
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Stake* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Stake',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    poolName:'GIV farm',
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"amount" is required')
        }
    });


    it('should create *UnStake* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'UnStake',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                poolName:'GIV farm',
                amount:'20',
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *UnStake* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'UnStake',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    poolName:'GIV farm',
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"amount" is required')
        }
    });


    it('should create *GIVbacks are ready to claim* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'GIVbacks are ready to claim',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                round:5,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *GIVbacks are ready to claim* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'GIVbacks are ready to claim',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"round" is required')
        }
    });




    it('should create *Project edited* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project edited',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project edited* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project edited',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project badge revoked* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project badge revoked',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project badge revoked* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project badge revoked',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Project unverified* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Project unverified',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Project unverified* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Project unverified',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });



    it('should create *Send email confirmation* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Send email confirmation',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {}
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        console.log('**result**', result.data)
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);

    });


    it('should create *Made donation* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Made donation',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Made donation* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Made donation',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


    it('should create *Donation received* notification,  success, segment is off', async () => {
        const data = {
            eventName: 'Donation received',
            sendEmail: false,
            sendSegment: false,
            userWalletAddress: generateRandomEthereumAddress(),
            metadata: {
                projectTitle,
                projectLink,
            }
        }

        const result = await axios.post(sendNotificationUrl,
            data,
            {
                headers: {
                    authorization: getGivethIoBasicAuth()
                }
            }
        )
        assert.equal(result.status, 200);
        assert.isOk(result.data);
        assert.isTrue(result.data.success);
    });
    it('should create *Donation received* notification,  failed invalid metadata, segment is off', async () => {
        try {
            const data = {
                eventName: 'Donation received',
                sendEmail: false,
                sendSegment: false,
                userWalletAddress: generateRandomEthereumAddress(),
                metadata: {
                    projectLink,
                }
            }

            await axios.post(sendNotificationUrl,
                data,
                {
                    headers: {
                        authorization: getGivethIoBasicAuth()
                    }
                }
            )
            // If request doesn't fail, it means this test failed
            assert.isTrue(false)
        } catch (e: any) {
            assert.equal(e.response.data.message, errorMessagesEnum.IMPACT_GRAPH_VALIDATION_ERROR.message)
            assert.equal(e.response.data.description, '"projectTitle" is required')
        }
    });


}
