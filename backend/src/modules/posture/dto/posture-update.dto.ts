import { PartialType } from "@nestjs/mapped-types";
import { PostureDto } from "./posture.dto";

export class PostureUpdateDto extends PartialType(PostureDto) { }