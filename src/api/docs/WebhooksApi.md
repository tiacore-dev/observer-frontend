# WebhooksApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteBotWebhookApiWebhookBotIdDeleteDelete**](#deletebotwebhookapiwebhookbotiddeletedelete) | **DELETE** /api/webhook/{bot_id}/delete | Delete Bot Webhook|
|[**getBotWebhookInfoApiWebhookBotIdInfoGet**](#getbotwebhookinfoapiwebhookbotidinfoget) | **GET** /api/webhook/{bot_id}/info | Get Bot Webhook Info|
|[**setBotWebhookApiWebhookBotIdSetPatch**](#setbotwebhookapiwebhookbotidsetpatch) | **PATCH** /api/webhook/{bot_id}/set | Set Bot Webhook|
|[**telegramWebhookApiWebhookUpdatesPost**](#telegramwebhookapiwebhookupdatespost) | **POST** /api/webhook/updates | Telegram Webhook|

# **deleteBotWebhookApiWebhookBotIdDeleteDelete**
> deleteBotWebhookApiWebhookBotIdDeleteDelete()


### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let botId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteBotWebhookApiWebhookBotIdDeleteDelete(
    botId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **botId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getBotWebhookInfoApiWebhookBotIdInfoGet**
> any getBotWebhookInfoApiWebhookBotIdInfoGet()


### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let botId: number; // (default to undefined)

const { status, data } = await apiInstance.getBotWebhookInfoApiWebhookBotIdInfoGet(
    botId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **botId** | [**number**] |  | defaults to undefined|


### Return type

**any**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setBotWebhookApiWebhookBotIdSetPatch**
> setBotWebhookApiWebhookBotIdSetPatch()


### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let botId: number; // (default to undefined)

const { status, data } = await apiInstance.setBotWebhookApiWebhookBotIdSetPatch(
    botId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **botId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **telegramWebhookApiWebhookUpdatesPost**
> any telegramWebhookApiWebhookUpdatesPost()


### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let xTelegramBotApiSecretToken: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.telegramWebhookApiWebhookUpdatesPost(
    xTelegramBotApiSecretToken
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **xTelegramBotApiSecretToken** | [**string**] |  | (optional) defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

