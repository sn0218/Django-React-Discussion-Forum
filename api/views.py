from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Thread, Post, User
from .serializers import ThreadSerializer, PostSerializer, MyTokenObtainPairSerializer, RegisterSerializer
import json
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.pagination import PageNumberPagination


# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register',
        '/api/token/refresh/'
    ]
    return Response(routes)


@api_view(['GET'])
def getThreads(request):
    # set pagination
    paginator = PageNumberPagination()
    paginator.page_size = 15
    threads = Thread.objects.all().order_by('-updated')
    result_page = paginator.paginate_queryset(threads, request)
    serializer = ThreadSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def getThread(request, thread_id):
    thread = Thread.objects.get(pk=thread_id)
    serializer = ThreadSerializer(thread, many=False)

    return Response(serializer.data)


@api_view(['GET'])
def getPosts(request, thread_id):
    # set pagination
    paginator = PageNumberPagination()
    paginator.page_size = 10

    # get the thread
    thread = Thread.objects.get(pk=thread_id)

    # get all post belong to the given thread
    posts = thread.thread_posts.order_by('created').all()
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)
    
    return paginator.get_paginated_response(serializer.data)


@api_view(['POST'])
def createThread(request):

    data = json.loads(request.body)
    
    # handle unauthenticated user or invalid user
    try:
        userID =  data['creator']['user']['user_id']
    except TypeError:
        return Response(
                {"res": "Unauthenticated user"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    subject = data['subject']
    content = data['content']
    topic = data['topic'][0]['value']

    new_thread = Thread(
        subject=subject, 
        content=content, 
        creator=User.objects.get(pk=userID),
        topic=topic
        )
    new_thread.save()
    
    serializer = ThreadSerializer(new_thread, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def createPost(request):
    # get the data 
    data = json.loads(request.body)
 
    # handle unauthenticated user or invalid user
    try:
        userID =  data['creator']['user']['user_id']
    except TypeError:
        return Response(
                {"res": "Unauthenticated user"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

    content = data['content']
    threadID = data['thread']

    # update reply count of the assoicated thread
    thread = Thread.objects.get(pk=threadID)
    thread.replyCount += 1
    thread.save()

    # create new post object
    new_post = Post(
        content=content,
        creator=User.objects.get(pk=userID),
        thread=thread
    )
    new_post.save()

    serializer = PostSerializer(new_post, many=False)

    return Response(serializer.data)


