from flask import Flask, request
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps, loads
from flask.ext.jsonpify import jsonify

from ipynb.fs.full.Model import test_predict3, predict_with_data

app = Flask(__name__)
api = Api(app)

@app.route('/')
def index():
    return "Hello, World!."

@app.route('/predict_test')
def predict_test():
    result = test_predict3()
    print('result is ->>', result)
    return jsonify(result)

@app.route('/test', methods=['POST'])
def test():
    print('data -->', request.data)
    dataDict = loads(request.data)
    return jsonify(dataDict['leap_data'])


@app.route('/predict', methods=['POST'])
def predict():
    dataDict = loads(request.data)
    #print(dataDict[0][0]['frame_id'])
    result = predict_with_data(dataDict['leap_data'])
    return jsonify(result)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
