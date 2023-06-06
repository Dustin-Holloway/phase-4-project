#!/usr/bin/env python3

from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError


import ipdb


# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Listing, Comment

# Views go here!


if __name__ == "__main__":
    app.run(port=5555, debug=True)
