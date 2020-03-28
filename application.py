import os

from flask import Flask, session, render_template, request, flash, redirect, url_for, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit
import datetime

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = "123vsd2312_823!!"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
socketio = SocketIO(app)
Session(app)

users = []
channels = []

@app.route("/")
def index():
    return render_template ("index.html")

@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        session.clear()
        error = None
        name = request.form.get("nickname")
        if name in users:
            error = 'The name is taken'
        else:
            users.append(name)
            session['name']=name
            return render_template ("welcome.html", name=name, channels=channels)
        return render_template ("index.html", error=error)
    return render_template("index.html")

@app.route("/homepage")
def homepage():
    if 'name' in session:
        name = session.get('name')
        return render_template ("welcome.html", name=name, channels=channels)
    return render_template ("index.html")

@app.route("/logout")
def logout():
    session.pop("name", None)
    return redirect(url_for("login"))

@socketio.on("create channel")
def create(data):
    channel_name = data["channel_name"]
    channel_host = session.get('name')
    creation_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    channel = {'channel_name':channel_name, 'channel_host':channel_host, 'creation_time':creation_time}
    channels.append(channel)
    emit("announce creation", channel, broadcast=True)

@app.route("/channels", methods=["POST"])
def channels_load():
    return jsonify(channels)

if __name__ == '__main__':
    socketio.run(app)
    app.run(debug=True)
