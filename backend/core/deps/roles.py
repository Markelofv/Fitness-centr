from fastapi import Depends, HTTPException, status

from core.deps.current_user import get_current_user
from models.user import User


def require_role(*roles: str):

    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role.name not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав",
            )
        return user

    return checker