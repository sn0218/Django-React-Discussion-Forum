from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Thread, Post, Profile, User, Pin
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# customized Token Obtain Pair Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # encrypt username for custom claim
        token['username'] = user.username

        return token


# register serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ThreadSerializer(ModelSerializer):
    creator_id = serializers.SerializerMethodField('creator_id')

    def creator_id(self):
        creator_id = serializers.IntegerField()
        return creator_id 

    creator = serializers.CharField()
    created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")

    class Meta:
        model = Thread
        fields = ("id",
                    "creator",
                    "created",
                    "subject",
                    "content",
                    "topic",
                    "updated",
                    "replyCount",
                    "creator_id")


class PostSerializer(ModelSerializer):
    creator_id = serializers.SerializerMethodField('creator_id')

    def creator_id(self):
        creator_id = serializers.IntegerField()
        return creator_id 

    creator = serializers.CharField()
    created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    updated = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = Post
        fields = (("id",
                    "creator",
                    "created",
                    "content",
                    "updated",
                    "thread",
                    "creator_id"))


class PinSerializer(ModelSerializer):
    class Meta:
        model = Pin
        fields =  '__all__'

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields =  ['name', 'bio', 'avatar', 'status']