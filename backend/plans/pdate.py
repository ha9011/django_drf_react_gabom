from urllib.request import urlopen
from urllib.parse import urlencode, unquote, quote_plus
import urllib
import requests
import json
from xml.etree.ElementTree import parse
import xmltodict
import math


def getSiGunGuCodeData(areacode):
    serviceKey = "0dgW%2FAxKDhja1lFTHtAWUdeYst1O7P6LMdGDoXTruvLrBg9I4ipAXjfUXaGuAzgsVS0rjNA4Q%2FO%2B1bz0WqfgIQ%3D%3D"
    try:

        url = (
            "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode?ServiceKey="
            + serviceKey
            + "&areaCode="
            + areacode
            + "&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest"
        )

        print("url")
        print(url)

        request = urllib.request.Request(url)

        request.get_method = lambda: "GET"

        response_body = urlopen(request).read()

        decode_data = response_body.decode("utf-8")
        print(type(decode_data))

        xml_parse = xmltodict.parse(decode_data)  # string인 xml 파싱
        xml_dict = json.loads(json.dumps(xml_parse))
        print(xml_dict)
        print(xml_dict["response"]["body"]["items"]["item"])
        return xml_dict["response"]["body"]["items"]["item"]

    except Exception as er:

        print(er)

    else:

        return ""


def getPlaceData(areacode, sigungu, page):
    serviceKey = "0dgW%2FAxKDhja1lFTHtAWUdeYst1O7P6LMdGDoXTruvLrBg9I4ipAXjfUXaGuAzgsVS0rjNA4Q%2FO%2B1bz0WqfgIQ%3D%3D"
    try:

        url = (
            "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey="
            + serviceKey
            + "&numOfRows=1000"
            + "&contentTypeId=12"
            + "&areaCode="
            + areacode
            + "&sigunguCode="
            + sigungu
            + "&MobileOS=ETC&MobileApp=AppTest"
        )

        print("url")
        print(url)

        request = urllib.request.Request(url)

        request.get_method = lambda: "GET"

        response_body = urlopen(request).read()

        decode_data = response_body.decode("utf-8")
        print(type(decode_data))

        xml_parse = xmltodict.parse(decode_data)  # string인 xml 파싱
        xml_dict = json.loads(json.dumps(xml_parse))
        print(xml_dict)
        # print(xml_dict["response"]["body"]["items"]["item"])
        resultDict = {}
        resultDict["items"] = xml_dict["response"]["body"]["items"]
        # print("===================")
        print(resultDict["items"]["item"])
        itemList = resultDict["items"]["item"]
        print("===처음")
        print(len(itemList))

        y = [s for s in itemList if "firstimage" in s]

        print("===최종")
        print(len(y))
        start = (int(page) - 1) * 9
        end = int(page) * 9
        resultDict["items"] = y[start:end]
        resultDict["pageNo"] = page
        resultDict["totalCount"] = len(y)
        resultDict["totalPage"] = math.ceil(len(y) / 9)

        return resultDict

    except Exception as er:

        print(er)

    else:

        return ""


def getPlaceId(placeId):
    serviceKey = "0dgW%2FAxKDhja1lFTHtAWUdeYst1O7P6LMdGDoXTruvLrBg9I4ipAXjfUXaGuAzgsVS0rjNA4Q%2FO%2B1bz0WqfgIQ%3D%3D"
    try:
        url = (
            "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey="
            + serviceKey
            + "&contentId="
            + placeId
            + "&defaultYN=Y"
            + "&mapinfoYN=Y"
            + "&addrinfoYN=Y"
            + "&overviewYN=Y"
            + "&firstImageYN=Y"
            + "&MobileOS=ETC&MobileApp=AppTest"
        )

        print("url")
        print(url)

        request = urllib.request.Request(url)

        request.get_method = lambda: "GET"

        response_body = urlopen(request).read()

        decode_data = response_body.decode("utf-8")
        print(type(decode_data))

        xml_parse = xmltodict.parse(decode_data)  # string인 xml 파싱
        xml_dict = json.loads(json.dumps(xml_parse))
        print(xml_dict)

        return xml_dict["response"]["body"]["items"]["item"]

    except Exception as er:

        print(er)

    else:

        return ""
