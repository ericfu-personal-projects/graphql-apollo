import { GraphQLError } from 'graphql';
function createError(message, code, status) {
    return new GraphQLError(message, {
        extensions: {
            code,
            http: { status },
        },
    });
}
const UnauthorizedError = createError('Unauthorized', 'UNAUTHORIZED', 401);
const InternalError = createError('InternalServerError', 'INTERNAL_ERROR', 500);
const InvalidCredentialsError = createError('Invalid credentials', 'INVALID_CREDENTIALS', 400);
const DuplicatedUserError = createError('User already exist', 'USER_EXIST', 409);
export default {
    UNAUTHORIZED: UnauthorizedError,
    INTERNAL_ERROR: InternalError,
    INVALID_CREDENTIALS: InvalidCredentialsError,
    DUPLICATED_USER: DuplicatedUserError,
};
