import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly disableThinking: boolean;

  constructor(private readonly config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.getOrThrow<string>('ANTHROPIC_API_KEY'),
    });
    this.model = this.config.getOrThrow<string>('AI_MODEL');
    this.disableThinking =
      this.config.get<string>('AI_DISABLE_THINKING') === 'true';
  }

  async generateText(
    system: string,
    user: string,
    maxTokens = 1000,
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
      ...(this.disableThinking
        ? { thinking: { type: 'disabled' as const } }
        : {}),
    });

    this.logger.log(
      `stop_reason=${response.stop_reason} / 입력 ${response.usage.input_tokens}토큰 / 출력 ${response.usage.output_tokens}토큰 / max_tokens=${maxTokens} / 블록=${response.content.map((b) => b.type).join(',')}`,
    );

    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');
  }
}