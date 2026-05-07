{
  "name": "Movie",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "\u7535\u5f71\u540d\u79f0"
    },
    "original_title": {
      "type": "string",
      "description": "\u539f\u59cb\u540d\u79f0"
    },
    "director": {
      "type": "string",
      "description": "\u5bfc\u6f14"
    },
    "actors": {
      "type": "string",
      "description": "\u4e3b\u6f14\uff0c\u9017\u53f7\u5206\u9694"
    },
    "genre": {
      "type": "string",
      "enum": [
        "\u52a8\u4f5c",
        "\u559c\u5267",
        "\u5267\u60c5",
        "\u79d1\u5e7b",
        "\u6050\u6016",
        "\u7231\u60c5",
        "\u52a8\u753b",
        "\u60ac\u7591",
        "\u7eaa\u5f55\u7247",
        "\u6218\u4e89",
        "\u5386\u53f2",
        "\u5947\u5e7b"
      ],
      "description": "\u7535\u5f71\u7c7b\u578b"
    },
    "release_date": {
      "type": "string",
      "format": "date",
      "description": "\u4e0a\u6620\u65e5\u671f"
    },
    "duration": {
      "type": "number",
      "description": "\u65f6\u957f\uff08\u5206\u949f\uff09"
    },
    "country": {
      "type": "string",
      "description": "\u5236\u7247\u56fd\u5bb6"
    },
    "language": {
      "type": "string",
      "description": "\u8bed\u8a00"
    },
    "synopsis": {
      "type": "string",
      "description": "\u5267\u60c5\u7b80\u4ecb"
    },
    "poster_url": {
      "type": "string",
      "description": "\u6d77\u62a5\u56fe\u7247URL"
    },
    "rating": {
      "type": "number",
      "description": "\u5e73\u5747\u8bc4\u5206"
    },
    "rating_count": {
      "type": "number",
      "description": "\u8bc4\u5206\u4eba\u6570"
    },
    "status": {
      "type": "string",
      "enum": [
        "published",
        "draft"
      ],
      "default": "published",
      "description": "\u72b6\u6001"
    }
  },
  "required": [
    "title",
    "genre"
  ]
}