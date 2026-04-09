import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class OpenRouterApi implements ICredentialType {
	name = 'openRouterApi';
	displayName = 'OpenRouter API';
	icon: Icon = { light: 'file:openrouterlight.svg', dark: 'file:openrouter.svg' };
	documentationUrl = 'https://openrouter.ai/docs#authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://openrouter.ai/api/v1',
			url: '/models',
			method: 'GET',
		},
	};
}
