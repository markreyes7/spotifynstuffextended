from crypt import methods
import re
from urllib import response
from itsdangerous import json
import psycopg2
import os
import spotipy
from flask import Flask, jsonify, request
from spotipy.oauth2  import SpotifyOAuth
import random
import datetime
app = Flask(__name__)



scope = 'playlist-read-private playlist-read-collaborative user-top-read'



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
    cursor = connection.cursor()

    def get_genres(artist_id):
        curr_artist = spotify.artist(artist_id)
        genres = curr_artist["genres"]
        return genres


    def import_deleted_to_db(track):
        postgres_insert_query = """INSERT INTO artist (artist_name, song_name, make_date ,listened, genre, artist_id) VALUES (
                %s, %s, %s, %s, %s, %s) """
        song_listen_time = datetime.datetime.now()
        artist_name = track['artists'][0]['name']
        print("name is " + artist_name)
        artist_id = track['artists'][0]['id']
        print("id is " + artist_id)
        genres = get_genres(artist_id)
        song_name = track['name']
        print("song was " + song_name)
        record_to_insert = (artist_name, song_name, song_listen_time, True, genres, artist_id)
        cursor.execute(postgres_insert_query, record_to_insert)
        connection.commit()
        print("The artist was inserted")
        


    try:
        song_to_delete = request.json
        song = song_to_delete['track']  
        curr_playlist = spotify.playlist_items(os.environ['PLAYLIST_ID'])
        items = curr_playlist['items']
        track = items[int(song) - 1]['track']
        song_to_remove = track['uri']

        spotify.playlist_remove_specific_occurrences_of_items(os.environ['PLAYLIST_ID'],
                                                          [{"uri": song_to_remove, "positions": [int(song) - 1]}])
        import_deleted_to_db(track)
        cursor.close()
    except:
        print("too big")
        return "bad boy", 400

    return "Done", 201



@app.route("/addsong", methods=['POST', 'GET'])
def addsong():
    cursor = connection.cursor()
    def get_random_id_from_db():
    
        sql_SELECT_QUERY = "SELECT artist_id FROM artist ORDER BY RANDOM() LIMIT 1;"

        cursor.execute(sql_SELECT_QUERY)
        x = cursor.fetchone()[0]
        return x


    def get_random_album_id(artist_id):
        all_albums = spotify.artist_albums(artist_id, limit=25)
        length_of_all_albums = len(all_albums["items"])
        position = all_albums['items'][random.randint(0, length_of_all_albums - 1)]  # generates a random album
        album_id = position["id"]
        return album_id


    def get_random_song(album_id):
        current_tracks = spotify.album_tracks(album_id)
        total_tracks = len(current_tracks["items"])
        pos = current_tracks['items'][random.randint(0, total_tracks - 1)]
        song_name = pos['name']
        song_uri = pos['uri']
        return song_name, song_uri,



    song_import = False
    id_from_db = get_random_id_from_db()
    album_id = get_random_album_id(id_from_db)
    song_tuple = get_random_song(album_id)
    song_name = song_tuple[0]
    song_id = song_tuple[1]

    print(song_name)
    cursor.execute("""SELECT song_name FROM artist WHERE artist_id = %s """, (id_from_db,))
    for record in cursor:
        if song_name == record[0]:
            print("Matching songs")
            addsong()
            break
        else:
            print("no match. \n Adding to the playlist")
            song_import = True
        print(record[0] + " is our current song")
    
    if song_import:
        spotify.playlist_add_items(os.environ['PLAYLIST_ID'], [song_id])
    return jsonify({"song_name": song_name })

@app.route("/close_connection_cursor")
def close_connection_cursor():
    connection.close()
    return "Done", 201

    
@app.route("/long_term_artists", methods=['POST'])
def long_term_artists():

    request_from_client = request.json
    artist_count = request_from_client['count']
    
    if artist_count == 0:
        artist_count =8

    spotify_request_artist = spotify.current_user_top_artists(limit=artist_count, offset=0, time_range='long_term')
    artists = spotify_request_artist['items']
    artist_list = []
    image_list = []
    images_to_return =[]
    for count, value in enumerate(artists):
        artist_list.append(artists[count]['name'])

    for count, value in enumerate(artists):
        image_list.append(artists[count]['images'])
    
    for list in image_list:
         images_to_return.append(list[0]['url'])
           

    return jsonify({"artists_list": artist_list,
                    "artists_images": images_to_return})

@app.route("/medium_term_artists", methods=['POST'])
def medium_term_artists():

    request_from_client = request.json
    artist_count = request_from_client['count']
    
    if artist_count == 0:
        artist_count =8

    spotify_request_artist = spotify.current_user_top_artists(limit=artist_count, offset=0, time_range='medium_term')
    artists = spotify_request_artist['items']
    artist_list = []
    image_list = []
    images_to_return =[]
    for count, value in enumerate(artists):
        artist_list.append(artists[count]['name'])

    for count, value in enumerate(artists):
        image_list.append(artists[count]['images'])
    
    for list in image_list:
         images_to_return.append(list[0]['url'])
           

    return jsonify({"artists_list": artist_list,
                    "artists_images": images_to_return})


@app.route("/short_term_artists", methods=['POST'])
def short_term_artists():
    request_from_client = request.json
    artist_count = request_from_client['count']
    if artist_count == 0:
        artist_count =8

    spotify_request_artist = spotify.current_user_top_artists(limit=artist_count, offset=0, time_range='short_term')
    artists = spotify_request_artist['items']
    artist_list = []
    image_list = []
    images_to_return =[]
    for count, value in enumerate(artists):
        artist_list.append(artists[count]['name'])

    for count, value in enumerate(artists):
        image_list.append(artists[count]['images'])
    
    for list in image_list:
         images_to_return.append(list[0]['url'])
           

    return jsonify({"artists_list": artist_list,
                    "artists_images": images_to_return})


if __name__ == "__main__":
    app.run(debug=True)


   