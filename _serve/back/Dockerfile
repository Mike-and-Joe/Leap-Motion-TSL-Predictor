FROM continuumio/anaconda3
ADD . /back
WORKDIR /back
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
WORKDIR /back/src
CMD ["python", "./server.py"]