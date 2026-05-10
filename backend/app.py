from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

movies = [
    {
        "id": 1,
        "title": "Batman",
        "rating": 8.5
    },
    {
        "id": 2,
        "title": "Interstellar",
        "rating": 9.2
    }
]

@app.route("/movies")
def get_movies():
    return jsonify(movies)

if __name__ == "__main__":
    app.run(debug=True)