from routers.auth import router as auth_router
from routers.bookings import router as bookings_router
from routers.classes import router as classes_router
from routers.memberships import router as memberships_router
from routers.payments import router as payments_router
from routers.clients import router as clients_router
from routers.analytics import router as analytics_router

__all__ = [
    "auth_router",
    "bookings_router",
    "classes_router",
    "memberships_router",
    "payments_router",
    "clients_router",
    "analytics_router",
]