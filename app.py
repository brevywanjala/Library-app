import os
from flask_cors import CORS
from flask import *
from flask_mail import Mail,Message as f_Message
from models import School
from models import db_url
from sqlalchemy import create_engine,case,and_,func,or_
from sqlalchemy.orm import sessionmaker

engine = create_engine(db_url , echo=True,pool_size=20, max_overflow=30)
Session = sessionmaker(bind=engine)

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


@app.route("/")
def index():
    return render_template("index.html")
@app.route("/about")
def about():
    return render_template("about.html")
@app.route("/catalogue")
def catalogue():
    return render_template("catalogue.html")
@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/events")
def events():
    return render_template("events.html")
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate the input
        db_session=Session()
        if not email or not password:
            flash('Please fill in all fields.', 'danger')
            return render_template('login.html')

        school = db_session.query(School).filter_by(email=email).first()
        if school and school.check_password(password):
            session['school_id'] = school.id  # Save the school ID to the session
            flash('Logged in successfully!', 'success')
            return redirect("http://localhost:3000")  # Redirect to home or another dashboard page
        else:
            flash('Invalid email or password. Please try again.', 'danger')

    return render_template('login.html')
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        owners_name = request.form.get('owners_name')
        school_name = request.form.get('school_name')
        school_type = request.form.get('school_type')
        email = request.form.get('email')
        contacts = request.form.get('contacts')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # Validate the input
        db_session=Session()
        if not (owners_name and school_name and school_type and email and contacts and password):
            flash('Please fill in all fields.', 'danger')
            return render_template('register.html')

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')

        existing_school = db_session.query(School).filter_by(email=email).first()
        if existing_school:
            flash('Email already registered. Please login instead.', 'danger')
            return redirect(url_for('login'))

        # Create a new school object and add it to the database
        new_school = School(
            owners_name=owners_name,
            school_name=school_name,
            school_type=school_type,
            email=email,
            contacts=contacts
        )
        new_school.set_password(password)  # Set hashed password
        db_session.add(new_school)
        db_session.commit()
        flash('Registration successful. Please login.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=int(os.environ.get('PORT', 5001)))