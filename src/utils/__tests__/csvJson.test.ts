import { describe, it, expect } from 'vitest'
import { csvToJson, jsonToCsv, detectDelimiter } from '../csvJson'

describe('CSV-JSON转换工具', () => {
  describe('csvToJson', () => {
    it('应该正确转换带表头的CSV', () => {
      const csv = `name,age,city
John,25,New York
Jane,30,Los Angeles`
      
      const result = csvToJson(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25', city: 'New York' },
        { name: 'Jane', age: '30', city: 'Los Angeles' }
      ])
    })

    it('应该正确处理无表头的CSV', () => {
      const csv = `John,25,New York
Jane,30,Los Angeles`
      
      const result = csvToJson(csv, ',', undefined, false)
      
      expect(result).toEqual([
        { col1: 'John', col2: '25', col3: 'New York' },
        { col1: 'Jane', col2: '30', col3: 'Los Angeles' }
      ])
    })

    it('应该支持自定义分隔符', () => {
      const csv = `name;age;city
John;25;New York
Jane;30;Los Angeles`
      
      const result = csvToJson(csv, ';')
      
      expect(result).toEqual([
        { name: 'John', age: '25', city: 'New York' },
        { name: 'Jane', age: '30', city: 'Los Angeles' }
      ])
    })

    it('应该支持字段筛选', () => {
      const csv = `name,age,city,country
John,25,New York,USA
Jane,30,Los Angeles,USA`
      
      const result = csvToJson(csv, ',', ['name', 'city'])
      
      expect(result).toEqual([
        { name: 'John', city: 'New York' },
        { name: 'Jane', city: 'Los Angeles' }
      ])
    })

    it('应该处理空CSV', () => {
      const result = csvToJson('')
      expect(result).toEqual([])
    })

    it('应该处理只有表头的CSV', () => {
      const result = csvToJson('name,age,city')
      expect(result).toEqual([])
    })
  })

  describe('jsonToCsv', () => {
    it('应该正确转换JSON到CSV', () => {
      const json = [
        { name: 'John', age: '25', city: 'New York' },
        { name: 'Jane', age: '30', city: 'Los Angeles' }
      ]
      
      const result = jsonToCsv(json)
      
      expect(result).toBe('name,age,city\nJohn,25,New York\nJane,30,Los Angeles')
    })

    it('应该支持自定义分隔符', () => {
      const json = [
        { name: 'John', age: '25', city: 'New York' },
        { name: 'Jane', age: '30', city: 'Los Angeles' }
      ]
      
      const result = jsonToCsv(json, ';')
      
      expect(result).toBe('name;age;city\nJohn;25;New York\nJane;30;Los Angeles')
    })

    it('应该支持字段筛选', () => {
      const json = [
        { name: 'John', age: '25', city: 'New York', country: 'USA' },
        { name: 'Jane', age: '30', city: 'Los Angeles', country: 'USA' }
      ]
      
      const result = jsonToCsv(json, ',', ['name', 'city'])
      
      expect(result).toBe('name,city\nJohn,New York\nJane,Los Angeles')
    })

    it('应该处理包含分隔符的值', () => {
      const json = [
        { name: 'John, Jr.', age: '25', city: 'New York' }
      ]
      
      const result = jsonToCsv(json)
      
      expect(result).toBe('name,age,city\n"John, Jr.",25,New York')
    })

    it('应该处理包含引号的值', () => {
      const json = [
        { name: 'John "The Rock"', age: '25', city: 'New York' }
      ]
      
      const result = jsonToCsv(json)
      
      expect(result).toBe('name,age,city\n"John ""The Rock""",25,New York')
    })

    it('应该处理空数组', () => {
      const result = jsonToCsv([])
      expect(result).toBe('')
    })
  })

  describe('detectDelimiter', () => {
    it('应该检测逗号分隔符', () => {
      const csv = `name,age,city
John,25,New York
Jane,30,Los Angeles`
      
      const result = detectDelimiter(csv)
      expect(result).toBe(',')
    })

    it('应该检测分号分隔符', () => {
      const csv = `name;age;city
John;25;New York
Jane;30;Los Angeles`
      
      const result = detectDelimiter(csv)
      expect(result).toBe(';')
    })

    it('应该检测制表符分隔符', () => {
      const csv = `name\tage\tcity
John\t25\tNew York
Jane\t30\tLos Angeles`
      
      const result = detectDelimiter(csv)
      expect(result).toBe('\t')
    })

    it('应该检测管道符分隔符', () => {
      const csv = `name|age|city
John|25|New York
Jane|30|Los Angeles`
      
      const result = detectDelimiter(csv)
      expect(result).toBe('|')
    })

    it('应该默认返回逗号', () => {
      const csv = `invalid format`
      const result = detectDelimiter(csv)
      expect(result).toBe(',')
    })
  })
}) 