import os
from flask_cors import CORS
from flask import *
from flask_mail import Mail,Message as f_Message

app=Flask(__name__)


mail = Mail(app)
app.secret_key='skadwhbhKAcwey'

# Configure CORS for multiple routes and origins
CORS(app, resources={
    r"/*": {"origins": "https://nile-daycare.vercel.app"},
    r"/*": {"origins": "http://localhost:3000"},
    r"/*": {"origins": "http://localhost:3001"},
    r"/*": {"origins": "https://nile-oimswelas.vercel.app"},
    r"/*": {"origins": ["http://localhost:3000", "https://nile-daycare.vercel.app","https://nile-oimswelas.vercel.app","https://q-rscanner-woad.vercel.app","http://localhost:3001"]}
})

from blueprints import *
from books import books_blueprint


app.register_blueprint(books_blueprint, url_prefix='/books')






if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=int(os.environ.get('PORT', 5001)))