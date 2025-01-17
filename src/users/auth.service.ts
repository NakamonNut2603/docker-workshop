import { Injectable } from "@nestjs/common/decorators";
import { UsersService } from "./users.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const script = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.userService.find(email);
        if(users.length) {
            throw new BadRequestException("Email is used.")
        }
        const salt = randomBytes(8).toString("hex");
        const hash = await script(password, salt, 32) as Buffer;
        const result = salt + '.' + hash.toString("hex");
        const user = await this.userService.create(email, result);
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if(!user) {
            throw new NotFoundException("User not found.");
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await script(password, salt, 32)) as Buffer;

        if(storedHash === hash.toString("hex")) {
            return user;
        }
        else {
            throw new BadRequestException("Bad password.")
        }
    }
}