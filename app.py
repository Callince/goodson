from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/memories")
def memories():
    photos = [
        {"src": "images/memory1.jpg", "caption": "One of my favorite days 🐼💕"},
        {"src": "images/memory2.jpg", "caption": "Your smile here made my day 🌸✨"},
        {"src": "images/memory3.jpg", "caption": "A moment I'll never forget 🐼❤️"},
        {"src": "images/memory4.jpg", "caption": "Us against the world 💕🌸"},
        {"src": "images/memory5.jpg", "caption": "The day everything changed 🐼✨"},
        {"src": "images/memory6.jpg", "caption": "My happiest memory with you 💖🐼"},
        {"src": "images/memory7.jpg", "caption": "Where it all began 🌸💕"},
        {"src": "images/memory8.jpg", "caption": "Forever grateful for this moment 🐼❤️"},
        {"src": "images/memory9.jpg", "caption": "Every second with you is magic ✨💕"},
    ]
    return render_template("memories.html", photos=photos)


@app.route("/game")
def game():
    # Create pairs of photos for the matching game
    photos = [
        {"src": "images/memory1.jpg", "id": 1},
        {"src": "images/memory2.jpg", "id": 2},
        {"src": "images/memory3.jpg", "id": 3},
        {"src": "images/memory4.jpg", "id": 4},
        {"src": "images/memory5.jpg", "id": 5},
        {"src": "images/memory6.jpg", "id": 6},
        {"src": "images/memory7.jpg", "id": 7},
        {"src": "images/memory8.jpg", "id": 8},
        {"src": "images/memory9.jpg", "id": 9},
    ]
    return render_template("game.html", photos=photos)


@app.route("/proposal")
def proposal():
    return render_template("proposal.html")


if __name__ == "__main__":
    app.run(debug=True)
