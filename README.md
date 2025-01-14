
## System Definition (MS0)

### ReFlickt

#### Purpose

ReFlickt matches users randomly from a pool of movies, and once they have watched it, they’re invited to join discussions with another user who was matched with the same film. Here they can share thoughts and debate plot twists —all while discovering new films and making new friends. </br> Users are prompted to rate certain aspects of the film after seeing it and choose to recommend the movie or not, which acts as talking points for the discussion participants. The ratings and discussions are saved and always accessible to users. The pool of movies can be influenced by voting on it with vote tokens received every 24 hours.

#### Advanced Feature Description
The advanced feature of our project is the seamless integration of The Movie Database (TMDb) API, allowing our application to search for movie titles and retrieve comprehensive movie details using a movie ID. This includes accessing essential information like movie summaries, actor and director details, and their respective images. By leveraging TMDb's robust and regularly updated database, we eliminate the need to store or maintain this data within our own application, streamlining both storage and upkeep. This feature is implemented full-stack, from the backend service to frontend display, ensuring dynamic, up-to-date content for users.

### Pages

* **Log-in Page:** First page you are met by when you enter the application and are not signed in. Here you can enter your credentials to log in and end up on the Home Page or sign up to end om on the Register page.
* **Register Page:** Here you create an account with a unique email and username.
* **Home Page:** Here you can see what movies are in the pool, roll for a movie match and see your current match.
* **Discussion Page:** The chat room for a certain movie involving two users, that is creating after rating a movie you have been matched with.
* **Dashboard Page:** Contains user ratings and actions, like changing password. 
* **Movie Page:** You can search for a movie on the home page or click any poster to navigate here, displaying information for said movie. Here you can also add it to the random pool of movies spending tokens.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/ER-Diagram.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)
