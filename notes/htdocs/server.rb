
require 'rubygems'
require 'sinatra'

get '/' do
    '<a href=/Newtown_shooting>Newtown_shooting</a>'
end

get '/Sandy_Hook_Elementary_School_shooting' do
    redirect '/Newtown_shooting', 301
end

get '/Newtown_shooting' do
    #erb :story, :content_type => 'text/html'
    "hello"
end


