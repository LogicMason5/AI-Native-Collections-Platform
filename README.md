# NodeAir Backend
APIs and other backend stuff for NodeAir

## Getting started
1. Make sure you have Python 3.9 installed globally along with MySQL client and Redis server
2. Clone the repo `git clone https://github.com/GitBolt/NodeAir.git`
3. Create virtual environment using your favourite tool (virtualenv, pipenv, poetry, anaconda etc) and activate it
4. Install the packages `pip install -r requirements.txt`
5. Set `REDIS_URL` and `MYSQL_URL` (optional to work locally) environment variables
5. Start the server `uvicorn main:app --reload`

