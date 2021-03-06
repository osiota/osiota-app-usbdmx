<!--
Auto generated documentation:
  * Adapt schema.json and
  * Run npm run doc

Please edit schema.json or
	https://github.com/simonwalz/osiota-dev/blob/master/partials/main.md
-->
<a name="root"></a>
# osiota application usbdmx

*Osiota* is a software platform capable of running *distributed IoT applications* written in JavaScript to enable any kind of IoT tasks. See [osiota](https://github.com/osiota/osiota).

## Configuration: usbdmx


This application allows controlling lights via a DMX usb adapter.

**Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**device**<br/>(USB device)|`string`||yes|
|[**map**](#map)<br/>(DMX channels)|`object[]`||no|

**Additional Properties:** not allowed<br/>
**Example**

```json
{
    "device": "/dev/ttyUSB0",
    "map": [
        {
            "channel": 1,
            "node": "/my-dmx-channel",
            "default_value": 63
        }
    ]
}
```

<a name="map"></a>
### map\[\]: DMX channels

**Items: DMX channel**

**Item Properties**

|Name|Type|Description|Required|
|----|----|-----------|--------|
|**channel**|`number`|Minimum: `1`<br/>Maximum: `512`<br/>|yes|
|**node**<br/>(Node Name)|`string`||no|
|**default\_value**|`number`|Minimum: `0`<br/>Maximum: `255`<br/>|no|

**Item Additional Properties:** not allowed<br/>
**Example**

```json
[
    {
        "channel": 1,
        "node": "/my-dmx-channel",
        "default_value": 63
    }
]
```


## How to setup

Add a configuration object for this application, see [osiota configuration](https://github.com/osiota/osiota/blob/master/doc/configuration.md):

```json
{
    "name": "usbdmx",
    "config": CONFIG
}
```

## License

Osiota and this application are released under the MIT license.

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/osiota/osiota/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
