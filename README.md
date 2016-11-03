# Keepfast
Tool to monitor indicators of performance for webpages.

![image](https://i.cloudup.com/T8NZWsOiIh-3000x3000.png)
[Video Demo](https://cloudup.com/cQfUpvDHCcx)

The idea of the tool is to create a way of monitoring
indicators on the performance of a web page. Integrating these
indicators more easily, and enhance understanding of these
criteria for the entire development team. allowing
ability to manage the history of changes in these indicators
during the development cycle of the application. The main
indicators will be time page load, page size,
and score related to pagespeed and yslow.

## Instructions

#### How to run the project

1. Install [Git](http://git-scm.com/downloads), [MongoDB](http://docs.mongodb.org/manual/installation/) and [NodeJS](http://nodejs.org/download/).

2. Clone the project:
```bash
git clone https://github.com/davidsonfellipe/keepfast
```

3. Go to folder:
```bash
cd keepfast
```

4. Get one [API Key on Google Insights](https://developers.google.com/speed/docs/insights/v1/getting_started#auth):

5. Add your Google API Key on file /conf/pagespeed.json:
```javascript
{
    "key": "YOUR_KEY_HERE",
    "locale": "en",
    "type": "desktop"
}
```

6. Install dependencies:
```bash
sudo npm install
```

7. Run your MongoDB on 27017 port, or see [how to run](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#using-mongodb-from-homebrew-and-macports):
```bash
mongod
```

8. And run:
```bash
node server.js
```

9. It's running at [localhost:3000](http://localhost:3000)

#### Reference Values based on [http://httparchive.org/interesting.php](http://httparchive.org/interesting.php)
- Number of resources (39)
- Unique hosts (Max 18 domains)
- Transferred bytes (2169KB)
- PageSpeed (79)
- YSlow (80)
- Time to load (4 in seconds)

#### Author

[![Davidson Fellipe](http://gravatar.com/avatar/054c583ad5dc09a861874e14dcb43e4c?s=70)](https://github.com/davidsonfellipe)
<br>
[Davidson Fellipe](https://github.com/davidsonfellipe)

## Contribute

Anyone and everyone is welcome to contribute. See some [developers](https://github.com/davidsonfellipe/keepfast/graphs/contributors) that helped.

## License

Code is under [MIT](http://davidsonfellipe.mit-license.org) license
