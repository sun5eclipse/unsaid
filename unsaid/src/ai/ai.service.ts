import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
    private readonly client : Anthropic;
    private readonly model : string;

    constructor(private readonly config : ConfigService){
        this.client = new Anthropic({
            apiKey : this.config.getOrThrow<string>('ANTHROPIC_API_KEY'),
        });
        this.model = this.config.getOrThrow('AI_MODEL');
    }

    async generateText(
        system: string,
        user: string,
        maxTokens = 1000,
    ): Promise<string> {
        const response = await this.client.messages.create({
            model : this.model,
            max_tokens : maxTokens,
            system,
             messages: [{ role: 'user', content: user }],
        });

        return response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('');
    }
}
