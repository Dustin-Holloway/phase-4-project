from sqlalchemy import MetaData, ForeignKey
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt, metadata


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String)
    _password_hash = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    image = db.Column(db.String)
    unit = db.Column(db.Integer)

    listings = db.relationship("Listing", backref="user")
    user_listings = db.relationship("UserListing", back_populates="author")

    comments = association_proxy("user_listings", "comments")

    @property
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
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    comments = db.relationship("Comment", backref="listing")


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String)
    content = db.Column(db.String, nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey("listings.id"))

    user_listings = db.relationship("UserListing", back_populates="comments")


class UserListing(db.Model, SerializerMixin):
    __tablename__ = "user_listings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    comment_id = db.Column(db.Integer, db.ForeignKey("comments.id"))

    author = db.relationship("User", back_populates="user_listings")
    comments = db.relationship("Comment", back_populates="user_listings")
