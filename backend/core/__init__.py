"""Ядро приложения: безопасность и зависимости."""

from core.deps.current_user import get_current_user
from core.deps.roles import require_role
from core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

__all__ = [
    "create_access_token",
    "decode_access_token",
    "get_current_user",
    "hash_password",
    "require_role",
    "verify_password",
]