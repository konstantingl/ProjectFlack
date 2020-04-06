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
channels = [{'channel_name':'Cosmos', 'channel_host':'Mike', 'creation_time':" 18:27 P    |    Apr 03", 'url':'homepage/channel/Cosmos', 'messages': [{'message_text': "Hi!", 'message_sender': "Mike", 'creation_time': " 18:27 P    |    Apr 03"},{'message_text': "Hello!", 'message_sender': "Bob", 'creation_time': " 18:29 P    |    Apr 03"}]},
            {'channel_name':'Space', 'channel_host':'Mary', 'creation_time':" 20:20 P    |    Apr 03", 'url':'homepage/channel/Space', 'messages': [{'message_text': "Hi!", 'message_sender': "Mike", 'creation_time': " 18:27 P    |    Apr 03"},{'message_text': "Hello!", 'message_sender': "Bob", 'creation_time': " 18:29 P    |    Apr 03"}]},
            {'channel_name':'Stars', 'channel_host':'Roy', 'creation_time':" 12:54 P    |    Apr 03", 'url':'homepage/channel/Stars', 'messages': [{'message_text': "Hi!", 'message_sender': "Mike", 'creation_time': " 18:27 P    |    Apr 03"},{'message_text': "Hello!", 'message_sender': "Bob", 'creation_time': " 18:29 P    |    Apr 03"}]},
            {'channel_name':'COVID', 'channel_host':'Ivan', 'creation_time':" 18:27 P    |    Apr 03", 'url':'homepage/channel/COVID', 'messages': [{'message_text': "Hi!", 'message_sender': "Mike", 'creation_time': " 18:27 P    |    Apr 03"},{'message_text': "Hello!", 'message_sender': "Bob", 'creation_time': " 18:29 P    |    Apr 03"}]},
            {'channel_name':'Fruits', 'channel_host':'Jessica', 'creation_time':" 19:10 P    |    Apr 03", 'url':'homepage/channel/Fruits', 'messages': [{'message_text': "Hi!", 'message_sender': "Mike", 'creation_time': " 18:27 P    |    Apr 03"},{'message_text': "Hello!", 'message_sender': "Bob", 'creation_time': " 18:29 P    |    Apr 03"}]}]

@app.route("/")
def index():
    if 'url' in session:
        url = session['url']
        return redirect (url_for('channel_open', channel_name=url))
    return render_template ("index.html")

@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        session.clear()
        error = None
        name = request.form.get("nickname")
        if name in users:
            error = 'The name is taken'
            return render_template ("index.html", error=error)
        else:
            users.append(name)
            session['name']=name
            return redirect (url_for('homepage'))
    else:
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
    session.pop("url", None)
    return redirect(url_for("login"))

@socketio.on("create channel")
def create(data):
    channel_name = data["channel_name"]
    channel_host = session.get('name')
    creation_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    url = '/homepage/channel/' + channel_name
    channel = {'channel_name':channel_name, 'channel_host':channel_host, 'creation_time':creation_time, 'url':url, 'messages': []}
    channels.append(channel)
    emit("announce creation", channel, broadcast=True)

@app.route("/channels", methods=["POST"])
def channels_load():
    return jsonify(channels)

@app.route("/channel_names_check", methods=["POST"])
def channel_names_check():
    channel_name_ToCheck = request.form.get('channel_name')
    channel_names_list = [d.get('channel_name', None) for d in channels]
    if channel_name_ToCheck in channel_names_list:
        return 'Channel already exsists'
    else:
        return 'Channel doesn\'t exist yet'


# Messages channel open
@app.route("/homepage/channel/<channel_name>")
def channel_open(channel_name):
    if 'name' in session:
        name = session.get('name')
        session['url'] = channel_name
        return render_template ("messages.html", channel=channel_name, name=name)
    return render_template ("index.html")

# Messages story channels_load
@app.route("/messages", methods=["POST"])
def messages_load():
    channel_name = request.form.get('channel_name')
    channel = [d for d in channels if d['channel_name']==channel_name]
    messages_list = channel[0]['messages']
    return jsonify(messages_list)

@socketio.on("send message")
def send(data):
    message_text = data['message']
    channel_name = data['channel_name']
    message_sender = session.get('name')
    creation_time = datetime.datetime.now().strftime(" %H:%M %P    |    %b %d")
    message = {'message_text':message_text, 'message_sender':message_sender, 'creation_time':creation_time}

    for i in channels:
        if i['channel_name'] == channel_name:
            if len(i['messages']) > 99:
                i['messages'].pop(0)
            i['messages'].append(message)

    emit("announce creation", message, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
    app.run(debug=True)
