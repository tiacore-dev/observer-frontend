# ScheduleEditSchema


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chat** | **number** |  | [optional] [default to undefined]
**prompt** | **string** |  | [optional] [default to undefined]
**schedule_type** | **string** |  | [optional] [default to undefined]
**interval_hours** | **number** |  | [optional] [default to undefined]
**interval_minutes** | **number** |  | [optional] [default to undefined]
**time_of_day** | **string** |  | [optional] [default to undefined]
**cron_expression** | **string** |  | [optional] [default to undefined]
**run_at** | **string** |  | [optional] [default to undefined]
**target_chats** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**removed_chats** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**bot** | **number** |  | [optional] [default to undefined]
**enabled** | **boolean** |  | [optional] [default to undefined]
**send_strategy** | **string** |  | [optional] [default to undefined]
**time_to_send** | **string** |  | [optional] [default to undefined]
**send_after_minutes** | **number** |  | [optional] [default to undefined]
**company** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ScheduleEditSchema } from './api';

const instance: ScheduleEditSchema = {
    chat,
    prompt,
    schedule_type,
    interval_hours,
    interval_minutes,
    time_of_day,
    cron_expression,
    run_at,
    target_chats,
    removed_chats,
    bot,
    enabled,
    send_strategy,
    time_to_send,
    send_after_minutes,
    company,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
