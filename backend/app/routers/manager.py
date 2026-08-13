from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Feedback, ManagerResponse
from app.schemas import (
    FeedbackResponse,
    ManagerResponseCreate,
    FeedbackStatus
)
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/manager",
    tags=["Manager"]
)


def verify_manager(current_user: User):
    if current_user.role != "manager":
        raise HTTPException(
            status_code=403,
            detail="Manager access required"
        )


# Get all feedback
@router.get(
    "/feedback",
    response_model=list[FeedbackResponse]
)
def get_all_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_manager(current_user)

    feedback = db.query(Feedback).all()

    return feedback


# Get specific feedback
@router.get(
    "/feedback/{feedback_id}",
    response_model=FeedbackResponse
)
def get_feedback_for_manager(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_manager(current_user)

    feedback = db.query(Feedback).filter(
        Feedback.id == feedback_id
    ).first()

    if not feedback:
        raise HTTPException(
            status_code=404,
            detail="Feedback not found"
        )

    return feedback


# Respond to feedback
@router.post(
    "/feedback/{feedback_id}/response"
)
def respond_to_feedback(
    feedback_id: int,
    response_data: ManagerResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_manager(current_user)

    feedback = db.query(Feedback).filter(
        Feedback.id == feedback_id
    ).first()

    if not feedback:
        raise HTTPException(
            status_code=404,
            detail="Feedback not found"
        )

    new_response = ManagerResponse(
        feedback_id=feedback.id,
        manager_id=current_user.id,
        response_text=response_data.response_text
    )

    db.add(new_response)

    feedback.status = FeedbackStatus.RESPONDED.value

    db.commit()
    db.refresh(new_response)

    return {
        "message": "Response added successfully",
        "response_id": new_response.id
    }


# Update feedback status
@router.put(
    "/feedback/{feedback_id}/status"
)
def update_feedback_status(
    feedback_id: int,
    status: FeedbackStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_manager(current_user)

    feedback = db.query(Feedback).filter(
        Feedback.id == feedback_id
    ).first()

    if not feedback:
        raise HTTPException(
            status_code=404,
            detail="Feedback not found"
        )

    feedback.status = status.value

    db.commit()
    db.refresh(feedback)

    return feedback