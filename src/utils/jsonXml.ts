// JSON to XML conversion
export const jsonToXml = (obj: unknown, rootName: string = 'root'): string => {
  const convertValue = (value: unknown, name: string): string => {
    if (value === null || value === undefined) {
      return `<${name}/>`;
    }
    
    if (typeof value === 'string') {
      return `<${name}>${escapeXml(value)}</${name}>`;
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
      return `<${name}>${value}</${name}>`;
    }
    
    if (Array.isArray(value)) {
      return value.map(item => convertValue(item, name)).join('\n');
    }
    
    if (typeof value === 'object' && value !== null) {
      const attributes: string[] = [];
      const children: string[] = [];
      
      for (const [key, val] of Object.entries(value)) {
        if (key.startsWith('@')) {
          // Handle attributes
          attributes.push(`${key.slice(1)}="${escapeXml(String(val))}"`);
        } else {
          children.push(convertValue(val, key));
        }
      }
      
      const attrStr = attributes.length > 0 ? ' ' + attributes.join(' ') : '';
      const childrenStr = children.join('\n');
      
      if (children.length === 0) {
        return `<${name}${attrStr}/>`;
      }
      
      return `<${name}${attrStr}>\n${childrenStr}\n</${name}>`;
    }
    
    return `<${name}>${escapeXml(String(value))}</${name}>`;
  };
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n${convertValue(obj, rootName)}`;
};

// XML to JSON conversion
export const xmlToJson = (xmlString: string): unknown => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Invalid XML format');
  }
  
  const convertNode = (node: Element): unknown => {
    const result: Record<string, unknown> = {};
    
    // Handle attributes
    if (node.attributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        result[`@${attr.name}`] = attr.value;
      }
    }
    
    // Handle child nodes
    const childNodes = Array.from(node.childNodes);
    const textNodes = childNodes.filter(n => n.nodeType === Node.TEXT_NODE);
    const elementNodes = childNodes.filter(n => n.nodeType === Node.ELEMENT_NODE) as Element[];
    
    // If there's only text content
    if (elementNodes.length === 0 && textNodes.length > 0) {
      const textContent = textNodes.map(n => n.textContent).join('').trim();
      if (textContent) {
        return textContent;
      }
    }
    
    // Handle element children
    elementNodes.forEach(child => {
      const childName = child.nodeName;
      const childValue = convertNode(child);
      
      if (result[childName] === undefined) {
        result[childName] = childValue;
      } else if (Array.isArray(result[childName])) {
        (result[childName] as unknown[]).push(childValue);
      } else {
        result[childName] = [result[childName], childValue];
      }
    });
    
    return result;
  };
  
  const root = xmlDoc.documentElement;
  return convertNode(root);
};

// Escape XML special characters
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Detect if string is valid XML
export const isValidXml = (xmlString: string): boolean => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return xmlDoc.getElementsByTagName('parsererror').length === 0;
  } catch {
    return false;
  }
};

// Detect if string is valid JSON
export const isValidJson = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}; 