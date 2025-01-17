import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guard/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../Interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve.report.dto';
import { AdminGuard } from '../guard/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    } 

    @Patch("/:id")
    @UseGuards(AdminGuard)
    approveReport(@Param("id") id: string, @Body() body: ApproveReportDto) {
        console.log(id)
        return this.reportsService.changeApproval(id, body.approved);
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.getEstimate(query);
    }
}
