'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Student } from '@/types';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  UserPlus,
  Trash2,
  Edit,
  Save,
  X,
  Search,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageStudentsPage() {
  const { students, loadStudents } = useStore();
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state for new/edit student
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: 7,
  });

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const filteredStudents = students
    .filter(s => selectedGrade === 'all' || s.grade === selectedGrade)
    .filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddStudent = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create student');
      }

      toast.success('Ученик добавлен!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', grade: 7 });
      loadStudents();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка добавления');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
          grade: formData.grade,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      toast.success('Данные обновлены!');
      setEditingStudent(null);
      setFormData({ name: '', email: '', password: '', grade: 7 });
      loadStudents();
    } catch (error) {
      toast.error('Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Удалить ученика ${student.name}?`)) return;

    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      toast.success('Ученик удалён');
      loadStudents();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      grade: student.grade,
    });
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', password: '', grade: 7 });
  };

  return (
    <div className="min-h-screen">
      <Header title="Управление учениками" subtitle="Добавление, редактирование и удаление учеников" />

      <div className="p-8">
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить ученика
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            {['all', 7, 8, 9, 10].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade as number | 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedGrade === grade
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {grade === 'all' ? 'Все' : `${grade} класс`}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold text-white">{students.length}</p>
            <p className="text-xs text-gray-500">Всего</p>
          </Card>
          {[7, 8, 9, 10].map(grade => (
            <Card key={grade} className="p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {students.filter(s => s.grade === grade).length}
              </p>
              <p className="text-xs text-gray-500">{grade} класс</p>
            </Card>
          ))}
        </div>

        {/* Students Table */}
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Имя</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Класс</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Баллы</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Задачи</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-800/50">
                  {editingStudent?.id === student.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={formData.grade}
                          onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        >
                          {[7, 8, 9, 10].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{student.points}</td>
                      <td className="px-4 py-3 text-gray-400">{student.completedProblems.length}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={handleUpdateStudent}
                            disabled={loading}
                            className="p-1 text-green-400 hover:bg-green-400/10 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-400 hover:bg-gray-700 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-white font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-gray-400">{student.email}</td>
                      <td className="px-4 py-3 text-gray-400">{student.grade}</td>
                      <td className="px-4 py-3 text-yellow-400 font-medium">{student.points}</td>
                      <td className="px-4 py-3 text-green-400">{student.completedProblems.length}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(student)}
                            className="p-1 text-blue-400 hover:bg-blue-400/10 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Ученики не найдены
            </div>
          )}
        </Card>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Добавить ученика</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">ФИО</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Иванов Иван"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="ivan@dls.edu"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Пароль</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="password123"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Класс</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {[7, 8, 9, 10].map(g => (
                    <option key={g} value={g}>{g} класс</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', email: '', password: '', grade: 7 });
                }}
              >
                Отмена
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddStudent}
                disabled={loading}
              >
                {loading ? 'Добавление...' : 'Добавить'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
