#!/usr/bin/env python3

from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from models import User, Listing, Comment
from config import app, api, db
import ipdb
from flask import request
from flask_restful import Resource


class UserById(Resource):
    def get(self, id):
        user = db.session.query(User).filter_by(id=id).first()

        if user:
            return make_response(jsonify(user.to_dict(only=("username", "name"))), 201)

        return make_response(jsonify({"error": "user not found!"}), 404)

    def patch(self, id):
        request_json = request.get_json()
        updated_user = User.query.filter(User.id == id).first()
        if updated_user:
            for key, value in request_json.items():
                if hasattr(updated_user, key):
                    setattr(updated_user, key, value)
            # for attr in request_json:
            #     setattr(updated_user, attr, request.json[attr])
            db.session.add(updated_user)
            db.session.commit()
            return make_response(jsonify(updated_user.to_dict(only=("username",))), 200)

        return make_response({"Error": "User not found"}, 404)


class Login(Resource):
    def post(self):
        try:
            json_data = request.get_json()
            username = json_data.get("username")

            if not username:
                response = make_response({"error": "Username is required."}, 400)
                return response

            current_user = User.query.filter_by(username=username).first()

            if current_user:
                session["username"] = current_user.username
                response = make_response(
                    jsonify(
                        current_user.to_dict(
                            only=(
                                "id",
                                "username",
                                "name",
                                "unit",
                                "image",
                                "listings",
                                "comments",
                            )
                        )
                    ),
                    200,
                )  # Include the "username" key in the response JSON
                return response

            response = make_response({"error": "Invalid username or password."}, 401)
            return response

        except Exception as e:
            response = make_response({"error": str(e)}, 500)
            return response


class Logout(Resource):
    def delete(self):
        if session["username"]:
            session["username"] = None
            return {}, 200
        else:
            response = make_response({}, 401)
            return response


class CheckSession(Resource):
    def get(self):
        if "username" in session:
            user = User.query.filter_by(username=session["username"]).first()
            if user:
                response = make_response(jsonify(user.to_dict()), 200)
                return response

        response = make_response({}, 401)
        return response


class NewUser(Resource):
    def post(self):
        request_json = request.get_json()

        try:
            new_user = User(
                username=request_json.get("username"),
                name=request_json.get("name"),
                unit=request_json.get("unit"),
                image=request_json.get("image"),
            )

            new_user.password = request_json.get("password")

            db.session.add(new_user)
            db.session.commit()

            return make_response(jsonify(new_user.to_dict()), 201)

        except Exception:
            return make_response(jsonify({}), 400)


class UserComments(Resource):
    def get(self):
        new_listings = Comment.query.all()

        if new_listings:
            return make_response(
                jsonify(
                    [
                        comment.to_dict(
                            only=("comment_type", "content", "listing_id", "id")
                        )
                        for comment in new_listings
                    ]
                ),
                200,
            )
        return make_response({"error": "no comments found"}, 404)

    def post(self):
        request_json = request.get_json()

        try:
            new_comment = Comment(
                content=request_json.get("content"),
                comment_type=request_json.get("comment_type"),
                listing_id=request_json.get("listing_id"),
            )

            db.session.add(new_comment)
            db.session.commit()

            return make_response(
                jsonify(
                    new_comment.to_dict(
                        only=("content", "comment_type", "id", "listing_id")
                    )
                ),
                201,
            )

        except Exception:
            return make_response(jsonify({}), 400)


class UserCommentsById(Resource):
    def get(self, id):
        new_listing = Comment.query.get(id)

        if new_listing:
            return make_response(
                jsonify(new_listing.to_dict()),
                200,
            )
        return make_response({"error": "comment not found"}, 404)

    def delete(self, id):
        new_listing = Comment.query.get(id)

        if new_listing:
            db.session.delete(new_listing)
            db.session.commit()
            return make_response({}, 204)

    def patch(self, id):
        request_json = request.get_json()
        updated_comment = Comment.query.filter_by(id=id).first()
        if updated_comment:
            for key, value in request_json.items():
                if hasattr(updated_comment, key):
                    setattr(updated_comment, key, value)

            db.session.add(updated_comment)
            db.session.commit()
            return make_response(
                jsonify(updated_comment.to_dict(only=("id",))),
                201,
            )

        return make_response({"Error": "User not found"}, 404)


class ListingsById(Resource):
    def get(self, id):
        new_listing = Listing.query.get(id)

        if new_listing:
            return make_response(
                jsonify(new_listing.to_dict(only=("id",))),
                200,
            )
        return make_response({"error": "comment not found"}, 404)

    def delete(self, id):
        new_listing = Listing.query.get(id)

        if new_listing:
            db.session.delete(new_listing)
            db.session.commit()
            return make_response({}, 204)

    def patch(self, id):
        request_json = request.get_json()
        updated_comment = Listing.query.filter_by(id=id).first()
        if updated_comment:
            for key, value in request_json.items():
                if hasattr(updated_comment, key):
                    setattr(updated_comment, key, value)

            db.session.add(updated_comment)
            db.session.commit()
            return make_response(
                jsonify(updated_comment.to_dict(only=("id",))),
                201,
            )

        return make_response({"Error": "User not found"}, 404)


class Listings(Resource):
    def get(self):
        all_listings = Listing.query.all()

        if all_listings:
            return make_response(
                jsonify(
                    [
                        listing.to_dict(only=("image", "title", "content", "id"))
                        for listing in all_listings
                    ]
                ),
                200,
            )
        return make_response({"error": "no comments found"}, 404)

    def post(self):
        request_json = request.get_json()

        try:
            new_listing = Listing(
                image=request_json.get("image"),
                title=request_json.get("title"),
                content=request_json.get("content"),
            )

            db.session.add(new_listing)
            db.session.commit()

            return make_response(jsonify(new_listing.to_dict(only=("id",))), 201)

        except Exception:
            return make_response(jsonify({}), 400)


api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Login, "/login")
api.add_resource(UserById, "/users/<int:id>")
api.add_resource(NewUser, "/new_user")
api.add_resource(UserCommentsById, "/comments/<int:id>")
api.add_resource(UserComments, "/comments")
api.add_resource(Listings, "/listings")
api.add_resource(ListingsById, "/listings/<int:id>")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
