{
  "name": "Review",
  "type": "object",
  "properties": {
    "movie_id": {
      "type": "string",
      "description": "\u5173\u8054\u7535\u5f71ID"
    },
    "movie_title": {
      "type": "string",
      "description": "\u7535\u5f71\u540d\u79f0\uff08\u5197\u4f59\u5b58\u50a8\uff09"
    },
    "rating": {
      "type": "number",
      "description": "\u8bc4\u5206 1-10"
    },
    "content": {
      "type": "string",
      "description": "\u8bc4\u8bba\u5185\u5bb9"
    },
    "user_name": {
      "type": "string",
      "description": "\u7528\u6237\u540d"
    }
  },
  "required": [
    "movie_id",
    "rating"
  ]
}