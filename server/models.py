from sqlalchemy import MetaData, ForeignKey
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    _password_hash = db.Column(db.String)
    name = db.Column(db.String)
    image = db.Column(db.String)
    unit = db.Column(db.Integer)

    listings = db.relationship("Listing", back_populates="user")
    comments = db.relationship("Comment", back_populates="user")
    favorites = db.relationship("Favorite", back_populates="user")

    favorited_listings = association_proxy("favorites", "listing")

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))


class Listing(db.Model, SerializerMixin):
    __tablename__ = "listings"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    image = db.Column(db.String)
    title = db.Column(db.String)
    content = db.Column(db.String)

    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    user = db.relationship("User", back_populates="listings")
    comments = db.relationship("Comment", back_populates="listing")


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    comment_type = db.Column(db.String)
    content = db.Column(db.String, nullable=False)

    listing_id = db.Column(db.Integer, ForeignKey("listings.id"))
    user_id = db.Column(db.Integer, ForeignKey("users.id"))

    user = db.relationship("User", back_populates="comments")
    listing = db.relationship("Listing", back_populates="comments")
    favorite = db.relationship("Favorite", back_populates="comment")

    # serialize_rules = ("-user_listings", "listing_id")


class Favorite(db.Model, SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    comment_id = db.Column(db.Integer, ForeignKey("comments.id"))

    user = db.relationship("User", back_populates="favorites")
    comment = db.relationship("Comment", back_populates="favorite")
