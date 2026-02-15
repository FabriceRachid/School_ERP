class Grade {
  final String id;
  final String label;
  final double value;
  final double outOf;
  final DateTime date;
  final String type;

  Grade({
    required this.id,
    required this.label,
    required this.value,
    required this.outOf,
    required this.date,
    required this.type,
  });

  factory Grade.fromJson(Map<String, dynamic> json) {
    return Grade(
      id: json['id'] as String,
      label: json['label'] as String,
      value: (json['value'] as num).toDouble(),
      outOf: (json['outOf'] as num).toDouble(),
      date: DateTime.parse(json['date'] as String),
      type: json['type'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'label': label,
      'value': value,
      'outOf': outOf,
      'date': date.toIso8601String(),
      'type': type,
    };
  }

  double get percentage => (value / outOf) * 100;
}