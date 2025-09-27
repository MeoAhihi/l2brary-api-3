import { Controller } from '@nestjs/common';
import { DemographicService } from './demographic.service';

@Controller('demographic')
export class DemographicController {
  constructor(private readonly demographicService: DemographicService) {}
}
