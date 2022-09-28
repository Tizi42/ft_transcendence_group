import { Request } from "express";
import { User } from "../Users.entity";

interface RequestWithUser extends Request {
    user: User;
}
export default RequestWithUser;