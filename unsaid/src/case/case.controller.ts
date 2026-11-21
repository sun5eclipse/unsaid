import { BadRequestException, Body, Controller, Post ,Get} from '@nestjs/common';
import { DIFFICULTY_RULES } from './case.constants.js';
import { deriveCaseNumbers } from './case.rules.js';
import { generateCaseSchema } from './generate-case.schema.js';
import { buildCaseUserPrompt } from './case.prompt.js';
import { generatedCaseSchema } from './generated-case.schema.js';
import { sampleCase } from './sample-case.js';
import { validateCaseAgainstRequest } from './case.validator.js';
import { CaseService } from './case.service.js';
import { createCaseSeed , type CaseSeed} from './case.seed.js';

@Controller('case')
export class CaseController {
    constructor(private readonly caseService: CaseService) {}
    @Post('preview')
    preview(@Body() body : unknown){
        const parsed = generateCaseSchema.safeParse(body);

        if(!parsed.success){
            throw new BadRequestException(
                parsed.error.issues.map((issue) => ({
                    field : issue.path.join('.'),
                    message : issue.message,
                })),
            );
        }
        
        const settings = parsed.data;
        const seed = createCaseSeed(settings);
        return{
            settings,
            derived:{
                ...deriveCaseNumbers(settings.suspectCount),
                contradictions: DIFFICULTY_RULES[settings.difficulty].contradictions,
            },
            userPrompt: buildCaseUserPrompt(settings,seed),
            seed,
        };
    }
    @Get('sample-check')
    //샘플 사건으로 검사표를 시험함
    sampleCheck() {
        const result = generatedCaseSchema.safeParse(sampleCase);
        if (!result.success) {
                return {
                ok: false,
                stage: 'format',
                issues: result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            };
        }
        const settings = generateCaseSchema.parse({
            caseType: 'murder',
            mood: 'classic',
            suspectCount: 3,
            difficulty: 'hard',
        });
        const sampleSeed: CaseSeed = {
            culpritId: 's2',
            setting: '샘플',
            motive: '샘플',
            contradictionTypes: ['alibi'],
            lieStatementIds: ['s2-1'],
        };
        const problems = validateCaseAgainstRequest(
            result.data,
            settings,
            sampleSeed,
        );

        return {
            ok: problems.length === 0,
            stage: 'request-match',
            problems,
            title: result.data.title,
        };
    }
    @Post('generate')
    async generate(@Body() body: unknown) {
    const parsed = generateCaseSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      );
    }
    return this.caseService.generate(parsed.data);
  }
}
