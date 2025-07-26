import { describe, it, expect } from 'vitest'
import { jsonToXml, isValidJson } from '../jsonXml'

describe('JSON-XML转换工具', () => {
  describe('jsonToXml', () => {
    it('应该正确转换简单对象', () => {
      const json = { name: 'John', age: 25 }
      const result = jsonToXml(json, 'person')
      
      expect(typeof result).toBe('string')
      expect(result.includes('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
      expect(result.includes('<person>')).toBe(true)
      expect(result.includes('<name>John</name>')).toBe(true)
      expect(result.includes('<age>25</age>')).toBe(true)
      expect(result.includes('</person>')).toBe(true)
    })

    it('应该处理嵌套对象', () => {
      const json = {
        person: {
          name: 'John',
          address: {
            city: 'New York',
            country: 'USA'
          }
        }
      }
      
      const result = jsonToXml(json, 'root')
      
      expect(result.includes('<person>')).toBe(true)
      expect(result.includes('<address>')).toBe(true)
      expect(result.includes('<city>New York</city>')).toBe(true)
      expect(result.includes('<country>USA</country>')).toBe(true)
    })

    it('应该处理数组', () => {
      const json = {
        people: [
          { name: 'John', age: 25 },
          { name: 'Jane', age: 30 }
        ]
      }
      
      const result = jsonToXml(json, 'root')
      
      expect(result.includes('<people>')).toBe(true)
      expect(result.includes('<name>John</name>')).toBe(true)
      expect(result.includes('<name>Jane</name>')).toBe(true)
    })

    it('应该处理属性', () => {
      const json = {
        person: {
          '@id': '1',
          '@type': 'user',
          name: 'John',
          age: 25
        }
      }
      
      const result = jsonToXml(json, 'root')
      
      expect(result.includes('<person id="1" type="user">')).toBe(true)
      expect(result.includes('<name>John</name>')).toBe(true)
    })

    it('应该转义XML特殊字符', () => {
      const json = { text: 'Hello & World < 10 > 5' }
      const result = jsonToXml(json, 'root')
      
      expect(result.includes('<text>Hello &amp; World &lt; 10 &gt; 5</text>')).toBe(true)
    })

    it('应该处理null和undefined值', () => {
      const json = { name: 'John', age: null, city: undefined }
      const result = jsonToXml(json, 'root')
      
      expect(result.includes('<name>John</name>')).toBe(true)
      expect(result.includes('<age/>')).toBe(true)
      expect(result.includes('<city/>')).toBe(true)
    })

    it('应该处理布尔值', () => {
      const json = { active: true, verified: false }
      const result = jsonToXml(json, 'root')
      
      expect(result.includes('<active>true</active>')).toBe(true)
      expect(result.includes('<verified>false</verified>')).toBe(true)
    })
  })

  describe('isValidJson', () => {
    it('应该验证有效JSON', () => {
      const validJson = '{"name": "John", "age": 25}'
      expect(isValidJson(validJson)).toBe(true)
    })

    it('应该验证无效JSON', () => {
      const invalidJson = '{"name": "John", "age": 25'
      expect(isValidJson(invalidJson)).toBe(false)
    })

    it('应该处理空字符串', () => {
      expect(isValidJson('')).toBe(false)
    })

    it('应该验证数组JSON', () => {
      const validJson = '[1, 2, 3]'
      expect(isValidJson(validJson)).toBe(true)
    })
  })
}) 