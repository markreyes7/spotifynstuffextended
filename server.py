from crypt import methods
from urllib import response
import psycopg2
import os
import spotipy
from flask import Flask, jsonify, request
from spotipy.oauth2  import SpotifyOAuth

app = Flask(__name__)

scope = 'playlist-read-private playlist-read-collaborative'

connection = psycopg2.connect(user=os.environ['USER'],
                              password=os.environ['PASSWORD'],
                              host=os.environ['HOST'],
                              port=os.environ['PORT'],
                              database=os.environ['DATABASE'])

spotify = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=os.environ['SPOTIPY_CLIENT_ID'],
                                                    client_secret=os.environ['SPOTIPY_CLIENT_SECRET'],
                                                    redirect_uri='https://google.com/',
                                                    scope=scope))

@app.route("/playlist")
def playlist():
    json_boy = spotify.playlist_items(os.environ['PLAYLIST_ID'])
    items = json_boy["items"]
    playlist = []
    for count, value in enumerate(items):
        playlist.append(items[count])
    songs = []
    for track in playlist:
        songs.append(track["track"]["name"])
    # song_name = playlist["track"]["name"]
    print("yessir")
    return jsonify({"members": songs})

@app.route("/removesong", methods=['POST'])
def removesong():
    song_to_delete = request.json
    song = song_to_delete['track']  
    curr_playlist = spotify.playlist_items(os.environ['PLAYLIST_ID'])
    items = curr_playlist['items']
    track = items[int(song) - 1]['track']
    song_to_remove = track['uri']

    spotify.playlist_remove_specific_occurrences_of_items(os.environ['PLAYLIST_ID'],
                                                          [{"uri": song_to_remove, "positions": [int(song) - 1]}])

    
    return "Done", 201


if __name__ == "__main__":
    app.run(debug=True)


   