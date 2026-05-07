{
  "name": "Favorite",
  "type": "object",
  "properties": {
    "movie_id": {
      "type": "string",
      "description": "\u6536\u85cf\u7684\u7535\u5f71ID"
    },
    "movie_title": {
      "type": "string",
      "description": "\u7535\u5f71\u540d\u79f0"
    },
    "movie_poster": {
      "type": "string",
      "description": "\u7535\u5f71\u6d77\u62a5"
    },
    "movie_genre": {
      "type": "string",
      "description": "\u7535\u5f71\u7c7b\u578b"
    },
    "movie_rating": {
      "type": "number",
      "description": "\u7535\u5f71\u8bc4\u5206"
    }
  },
  "required": [
    "movie_id"
  ]
}