
from flask import *
books_blueprint = Blueprint('books_blueprint', __name__)
import sqlite3
from models import Staff,Student,Book,Borrowing,MaxBooks

from sqlalchemy import create_engine,case,and_,func,or_
from sqlalchemy.orm import sessionmaker
import datetime


from models import db_url
engine = create_engine(db_url , echo=True,pool_size=20, max_overflow=30)
Session = sessionmaker(bind=engine)
from flask import *
from datetime import datetime

def convert_to_title_case(s):
    # Convert each word in the string to title case
    return ' '.join(word.capitalize() for word in s.split())
@books_blueprint.route('/api/add-book/<int:school_id>', methods=['POST'])
def add_book(school_id):
    data = request.get_json()
    print(data, "this is the data")

    title = convert_to_title_case(data.get('title'))
    ISBN_no = data.get('ISBN_no')
    author = convert_to_title_case(data.get('author'))
    description = data.get('description')
    quantity = data.get('quantity')
    out_of_stock = data.get('out_of_stock')
    due_days = data.get('due_days')

    print(school_id, "this is the school_id")

    if not ISBN_no or not (4 < len(ISBN_no) < 13):
        return jsonify({'error': 'Invalid ISBN number. It must be between 5 and 12 characters long.'}), 400
    
    try:
        db_session = Session()
        
        new_book = Book(
            title=title,
            isbn_no=ISBN_no,
            author=author,
            description=description,
            quantity=quantity,
            school_id=school_id,
            out_of_stock=out_of_stock,
            due_days=due_days
        )
        db_session.add(new_book)
        db_session.commit()
        return jsonify({'message': 'Book added successfully', 'book_id': new_book.id}), 201
    except Exception as e:
        print(e, "this is the error")
        return jsonify({'error': str(e)}), 500
    finally:
        db_session.close()

        
        

@books_blueprint.route('/api/update-book/<int:school_id>', methods=['POST'])
def update_book(school_id):
    try:
        data = request.get_json()  # Get JSON data from the request
        print(data,"this is the data")
        book_id = data.get('book_id')
        title = convert_to_title_case(data.get('title'))
        author = convert_to_title_case(data.get('author'))
        description = data.get('description')
        genre = data.get('genre')
        quantity = data.get('quantity')
        ISBN_no=data.get("ISBN_no")
        out_of_stock = data.get('out_of_stock')
        due_days = data.get('due_days')

        db_session = Session()
        book = db_session.query(Book).filter_by(id=book_id,school_id=school_id).first()
        
        if book:
            print("we found a book")
            print("this is the isbn",ISBN_no)
            book.title = title
            book.author = author
            book.isbn_no=ISBN_no
            book.description = description
            book.genre = genre  # Update genre
            book.quantity = quantity
            book.out_of_stock = out_of_stock
            book.due_days = due_days

            db_session.commit()
            return jsonify({'message': 'Book updated successfully', 'book_id': book.id}), 200  # Return success response
        else:
            return jsonify({'error': 'Book not found'}), 404  # Return not found response

    except Exception as e:
        db_session.rollback()
        return jsonify({'error': str(e)}), 500  # Return error response
    finally:
        db_session.close()
@books_blueprint.route('/api/books/<int:school_id>', methods=['GET'])
def fetch_books(school_id):
    try:
        db_session = Session()
        books = db_session.query(Book).filter(Book.school_id==school_id).all()  # Fetch all books from the database
        db_session.close()

        # Convert the book objects to a list of dictionaries
        books_list = [{
            'id': book.id,
            'title': book.title,
            'ISBN_no': book.isbn_no,
            'author': book.author,
            'genre': book.genre,
            'description': book.description,
            'quantity': book.quantity,
            'out_of_stock': book.out_of_stock,
            'due_days': book.due_days
        } for book in books]

        return jsonify(books_list), 200  # Return the list of books as JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return error response
@books_blueprint.route('/check-out-of-stock', methods=['GET'])
def check_out_of_stock():
    try:
        db_session = Session()
        out_of_stock_books = db_session.query(Book.title).filter(Book.out_of_stock >= Book.quantity).all()
        out_of_stock_books = [row[0] for row in out_of_stock_books]
        return jsonify(out_of_stock_books)
    except Exception as e:
        flash(f'Error: {str(e)}')
    finally:
        db_session.close()

@books_blueprint.route('/api/borrow/<int:school_id>', methods=['POST'])
def borrow_book_api(school_id):
    db_session = Session()
    try:
        data=request.json
        print(data,"this is the daat")
        user_no = data.get('user_no')
        user_type = data.get("usertype")
        isbn=data.get("isbn")
        
        
        user = None

        if user_type == 'teacher':
            user = db_session.query(Staff).filter_by(staff_no=user_no).first()
        elif user_type == 'student':
            user = db_session.query(Student).filter_by(admission_no=user_no).first()

        if user:
            user_id = user.id
        else:
            return jsonify({"error": f'User with username "{user_no}" not found.'}), 404

        book = db_session.query(Book).filter_by(isbn_no=isbn,school_id=school_id).first()
        if not book:
            return jsonify({"error": "Book not found."}), 404

        if book.out_of_stock >= book.quantity:
            return jsonify({"error": "Book is out of stock!"}), 400

        max_books_info = db_session.query(MaxBooks).filter_by(user_type=user_type,school_id=school_id).first()
        if not max_books_info:
            return jsonify({"error": "Maximum quantity not set for user type."}), 400

        max_quantity = max_books_info.max_quantity
        current_borrowed = db_session.query(Borrowing).filter_by(user_id=user_id, user_type=user_type,school_id=school_id).count()

        if book.quantity <= 0 or current_borrowed >= max_quantity:
            return jsonify({"error": "Cannot borrow more books!"}), 400

        due_days = book.due_days
        borrowed_on = datetime.now().date()

        book.quantity -= 1
        db_session.add(Borrowing(book_id=book.id, user_id=user_id, user_type=user_type, borrowed_on=borrowed_on,school_id=school_id))
        db_session.commit()

        return jsonify({"success": "Book borrowed successfully!"}), 200

    except Exception as e:
        db_session.rollback()  # Rollback any changes if an error occurs
        return jsonify({"error": f"Error: {str(e)}"}), 500

    finally:
        db_session.close()
@books_blueprint.route('/api/borrowed-books/<int:school_id>', methods=['GET'])
def get_unreturned_books(school_id):
    db_session = Session()
    try:
        user_no = request.args.get('studentNo').strip()  # Use `args.get` for GET parameters
        user_type = "student"  # Set user_type here for simplicity
        
        if not user_no or len(user_no) == 0:
            return jsonify({"error": "User not found"}), 404

        user = None
        if user_type == 'teacher':
            user = db_session.query(Staff).filter_by(staff_no=user_no,school_id=school_id).first()
        elif user_type == 'student':
            user = db_session.query(Student).filter_by(admission_no=user_no,school_id=school_id).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        user_id = user.id
        unreturned_books = db_session.query(Book.title, Book.id, Borrowing.borrowed_on).join(Borrowing).filter(
            Borrowing.user_id == user_id,Borrowing.school_id==school_id, Borrowing.user_type == user_type).all()

        # Convert results to a list of dictionaries
        books_list = [
            {"title": title, "id": book_id, "borrowed_on": borrowed_on.isoformat()}
            for title, book_id, borrowed_on in unreturned_books
        ]
        
        return jsonify({
            "unreturned_books": books_list,
            "user_type": user_type,
            "user_id": user_id
        })
    except Exception as e:
        print(e, "this is the error")
        return jsonify({"error": f"Error: {str(e)}"}), 500
    finally:
        db_session.close()
@books_blueprint.route('/api/return/<int:book_id>/<int:school_id>', methods=['POST'])
def return_book(book_id,school_id):
    db_session = Session()
    try:
        data=request.json
        print(data,"this si te daat")
        user_no = data.get('user_no')
        user_type = data.get('user_type')
        

        if not user_no or not user_type:
            return jsonify({"error": "User ID and User Type are required."}), 400
        if user_type == 'teacher':
            user = db_session.query(Staff).filter_by(staff_no=user_no,school_id=school_id).first()
        elif user_type == 'student':
            user = db_session.query(Student).filter_by(admission_no=user_no,school_id=school_id).first()

        # Find the borrowing record
        borrowing = db_session.query(Borrowing).filter_by(book_id=book_id, user_id=user.id, user_type=user_type,school_id=school_id).first()

        if not borrowing:
            return jsonify({"error": "You did not borrow this book."}), 404

        # Find the book
        book = db_session.query(Book).filter_by(id=book_id,school_id=school_id).first()

        if not book:
            return jsonify({"error": "Book not found."}), 404

        # Update book quantity and delete borrowing record
        book.quantity += 1
        db_session.delete(borrowing)
        db_session.commit()

        return jsonify({"message": "Book returned successfully!"}), 200

    except Exception as e:
        print(e,"this is the error")
        return jsonify({"error": f"Error: {str(e)}"}), 500

    finally:
        db_session.close()


