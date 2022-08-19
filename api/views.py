from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Thread, Post, User, Pin, Profile
from .serializers import ThreadSerializer, PostSerializer, MyTokenObtainPairSerializer, RegisterSerializer, PinSerializer, ProfileSerializer
import json
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ObjectDoesNotExist


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
    try:
        thread = Thread.objects.get(pk=thread_id)
    except thread.DoesNotExist:
        content = {"The Thread does not exist."}
        return Response(content)

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
    print(data)
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


@api_view(['POST'])
def bookmark(request):
    
    # get the data 
    data = json.loads(request.body)
    
    userID =  data['user']
    threadID = data['thread']
    pin = data['pin']
   
    if pin:
        new_pin = Pin(
            user = User.objects.get(pk=userID),
            thread = Thread.objects.get(pk=threadID)
        )
        new_pin.save()

        serializer = PinSerializer(new_pin, many=False)
        return Response(serializer.data)
    else:
        pin = Pin.objects.filter(user=User.objects.get(pk=userID), thread=Thread.objects.get(pk=threadID))
        pin.delete()
        return Response("The bookmark is removed.")


@api_view(['GET'])
def checkBookmarked(request, thread_id, user_id):
    
    pin = Pin.objects.filter(user=User.objects.get(pk=user_id), thread=Thread.objects.get(pk=thread_id))
    
    if pin.exists():
        return Response({"pinned": "true"})

    return Response({"pinned": "false"})


@api_view(['GET'])
def getBookmarkedThreads(request, user_id):
    paginator = PageNumberPagination()
    paginator.page_size = 10

    # get the printed thread
    user = User.objects.get(pk=user_id)
    pins = user.user_pin.all().order_by('id').reverse()
    ids = [pin.thread.id for pin in pins]
    threads = [Thread.objects.get(pk=id) for id in ids]

    result_page = paginator.paginate_queryset(threads, request)
    serializer = ThreadSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def getTopThreads(request):
    # get top 5 threads with most replies
    threads = Thread.objects.all().order_by("replyCount").reverse()[0:5]

    serializer = ThreadSerializer(threads, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def getThreadsTopic(request, topic_id):
    paginator = PageNumberPagination()
    paginator.page_size = 10

    # get threads by topic
    threads = Thread.objects.filter(topic=topic_id).all().order_by('-updated')

    result_page = paginator.paginate_queryset(threads, request)
    serializer = ThreadSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(['GET', 'PUT'])
def profile(request, user_id):
    if request.method == "GET":
        # get profile
        profile = Profile.objects.get(pk=user_id)
        serializer = ProfileSerializer(profile, many=False)
        return Response(serializer.data)

    elif request.method == "PUT":
        try:
            profile = Profile.objects.get(pk=user_id)
        except Profile.DoesNotExist:
            return Response({"res": "The profile is not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
      
        data = json.loads(request.body)
        bio = data.get("bio")
        avatar = data.get("avatar")

        # update the profile
        profile.bio = bio
        profile.avatar = avatar
        profile.save()

        return Response({"res": "The profile is updated sucessfully."})







    







